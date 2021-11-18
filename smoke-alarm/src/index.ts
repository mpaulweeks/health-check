import { Updater } from '@toughlovearena/updater';
import fs from 'fs';
import { SmokeAlarm, SmokeAlarmConfig } from "smoke-alarm";
import { SmokeAlarmVerify } from 'smoke-alarm/lib/types';

const oneMinute = 1000 * 60;
const oneHour = oneMinute * 60;

const auth: { awsKey: string, awsSecret: string } = JSON.parse(fs.readFileSync('auth.json').toString());
const verifyJson: SmokeAlarmVerify = resp => ({
  ok: !!resp.json,
});

const config: SmokeAlarmConfig = {
  intervalMS: oneMinute * 5,
  positiveIntervalMS: oneMinute * 60,

  recipients: [
    'mpaulweeks@gmail.com',
  ],
  auth: {
    awsSes: {
      from: 'toughlovearena.login@gmail.com',
      key: auth.awsKey,
      secret: auth.awsSecret,
    },
  },

  services: [{
    label: 'cat-herder.mpaulweeks.com',
    endpoints: [{
      url: 'https://cat-herder.mpaulweeks.com',
    }],
  }, {
    label: 'postboard.mpaulweeks.com',
    endpoints: [{
      url: 'https://postboard.mpaulweeks.com/health',
      verify: verifyJson,
    }],
  }, {
    label: 'type4.mpaulweeks.com',
    endpoints: [{
      url: 'https://type4.mpaulweeks.com',
    }],
  }, {
    label: 'poll.anny.nyc',
    endpoints: [{
      url: 'http://poll.anny.nyc',
    }],
  }, {
    label: 'poll.anny.nyc/admin',
    endpoints: [{
      url: 'http://poll.anny.nyc/admin',
    }],
  }, {
    label: 'poll.anny.nyc/api',
    endpoints: [{
      url: 'http://poll.anny.nyc/api/event/latest',
      verify: verifyJson,
    }],
  }, {
    label: 'mtgify.org',
    endpoints: [{
      url: 'https://mtgify.org',
    }],
    // }, {
    //   label: 'mtgify.org/json',
    //   endpoints: [{
    //     url: 'https://mtgify.org/json/version.json',
    //     verify: resp => {
    //       const updated = new Date(resp.json!.updated);
    //       const age = new Date().getTime() - updated.getTime();
    //       const window = oneHour * 30;
    //       return {
    //         ok: age < window,
    //         message: `updated ${Math.ceil(age / oneHour)}h ago`,
    //       };
    //     },
    //   }],
  }],
};

(async () => {
  new Updater().cron();
  new SmokeAlarm(config).start();
})();
