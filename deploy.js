const { spawnSync } = require('child_process');
const fs = require('fs-extra');
const path = require("path");

// Parameters
let region = 'us-east-1';
let bucket = ``;
let stack = ``;
let app = `index`;
let useEventBridge = false;

// const packages = [
//   // Use latest AWS SDK instead of default version provided by Lambda runtime
//   'aws-sdk',
//   'uuid',
// ];

function usage() {
  console.log(`Usage: deploy.sh [-r region] [-b bucket] [-s stack] [-a application] [-e]`);
  console.log(`  -r, --region       Target region, default '${region}'`);
  console.log(`  -b, --s3-bucket    S3 bucket for deployment, required`);
  console.log(`  -s, --stack-name   CloudFormation stack name, required`);
  console.log(`  -a, --application  Browser application to deploy, default '${app}'`);
  console.log(`  -e, --event-bridge Enable EventBridge integration, default is no integration`);
  console.log(`  -h, --help         Show help and exit`);
}

function ensureBucket() {
  const s3Api = spawnSync('aws', ['s3api', 'head-bucket', '--bucket', `${bucket}`, '--region', `${region}`]);
  if (s3Api.status !== 0) {
    console.log(`Creating S3 bucket ${bucket}`);
    const s3 = spawnSync('aws', ['s3', 'mb', `s3://${bucket}`, '--region', `${region}`]);
    if (s3.status !== 0) {
      console.log(`Failed to create bucket: ${JSON.stringify(s3)}`);
      console.log((s3.stderr || s3.stdout).toString());
      process.exit(s3.status)
    }
  }
}

function getArgOrExit(i, args) {
  if (i >= args.length) {
    console.log('Too few arguments');
    usage();
    process.exit(1);
  }
  return args[i];
}

function parseArgs() {
  var args = process.argv.slice(2);
  var i = 0;
  while (i < args.length) {
    switch(args[i]) {
      case '-h': case '--help':
        usage();
        process.exit(0);
        break;
      case '-r': case '--region':
        region = getArgOrExit(++i, args)
        break;
      case '-b': case '--s3-bucket':
        bucket = getArgOrExit(++i, args)
        break;
      case '-s': case '--stack-name':
        stack = getArgOrExit(++i, args)
        break;
      case '-a': case '--application':
        app = getArgOrExit(++i, args)
        break;
      case '-e': case '--event-bridge':
        useEventBridge = true;
        break;
      default:
        console.log(`Invalid argument ${args[i]}`);
        usage();
        process.exit(1)
    }
    ++i;
  }
  if (!stack.trim() || !bucket.trim()) {
    console.log('Missing required parameters');
    usage();
    process.exit(1);
  }
}

function spawnOrFail(command, args, options) {
  options = {
    ...options,
    shell: true
  };
  const cmd = spawnSync(command, args, options);
  if (cmd.error) {
    console.log(`Command ${command} failed with ${cmd.error.code}`);
    process.exit(255);
  }
  const output = cmd.stdout.toString();
  console.log(output);
  if (cmd.status !== 0) {
    console.log(`Command ${command} failed with exit code ${cmd.status} signal ${cmd.signal}`);
    console.log(cmd.stderr.toString());
    process.exit(cmd.status)
  }
  return output;
}

function appHtml(appName) {
  return `../client/dist/${appName}.html`
}



parseArgs();


if (!fs.existsSync('build')) {
  fs.mkdirSync('build');
}

console.log(`Usando la configuración: region ${region}, bucket ${bucket}, stack ${stack}`);
ensureBucket();


fs.copySync(appHtml(app), 'src/client/index.html');


spawnOrFail('sam', ['package', '--s3-bucket', `${bucket}`,
                    `--output-template-file`, `build/packaged.yaml`,
                    '--region',  `${region}`]);

console.log('Deploying serverless application');

spawnOrFail('sam', ['deploy', '--template-file', './build/packaged.yaml', '--stack-name', `${stack}`,
                    '--parameter-overrides', `UseEventBridge=${useEventBridge}`,
                    '--capabilities', 'CAPABILITY_IAM', '--region', `${region}`]);


const output = spawnOrFail('aws', ['cloudformation', 'describe-stacks', '--stack-name', `${stack}`,
  '--query', 'Stacks[0].Outputs[0].OutputValue', '--output', 'text', '--region', `${region}`]);


console.log(output.replace(/Prod/, 'Prod/v2'));

