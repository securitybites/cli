'use strict';

const chalk = require('chalk');
const program = require('commander');
const config = require('../config');
const { copy } = require('copy-paste');
const { login } = require('../oauth');

function authCommand () {
  program
    .command('auth')
    .option('-c, --copy', 'Copies the current access token to the clipboard')
    .description('Authenticate to the LifeOmic Platform to obtain an access token (Currently does not work for federated or social user accounts)')
    .action(async (options) => {
      const environment = config.getEnvironment();

      if (options.copy) {
        const accessToken = config.get(`${environment}.tokens.accessToken`);
        if (accessToken) {
          copy(accessToken, (err) => {
            if (err) {
              console.log(chalk.red(`Failed to copy access token to clipboard: ${err}`));
              process.exit(1);
            } else {
              console.log(chalk.green(`Access token copied to clipboard.`));
              // on linux the process hangs after copying to clipboard for
              // some reason, so this explicit exit call fixes that:
              process.exit(0);
            }
          });
        } else {
          console.log(chalk.red(`No access token present.  Run 'lo auth'.`));
          process.exit(1);
        }
      } else {
        if (config.get(`${environment}.defaults.useClientCredentials`)) {
          console.log(chalk.create(`auth command is not allowed for client credentials.`));
        } else {
          login();
        }
      }
    });
}

authCommand();
