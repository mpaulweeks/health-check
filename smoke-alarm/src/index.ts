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
const verifyUpdated = (extractDate: (json: any) => string): SmokeAlarmVerify => {
  return resp => {
    const dateStr = extractDate(resp.json!);
    const updated = new Date(dateStr);
    const age = new Date().getTime() - updated.getTime();
    const window = oneHour * 30;
    return {
      ok: age < window,
      message: `updated ${Math.ceil(age / oneHour)}h ago`,
    };
  }
};

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
    label: 'toughlovearena.com',
    endpoints: [{
      url: 'https://toughlovearena.com/version.json',
      verify: verifyJson,
    }],
  }, {
    label: 'type4.mpaulweeks.com',
    endpoints: [{
      url: 'https://type4.mpaulweeks.com',
    }],
  }, {
    label: 'mtgify.org',
    endpoints: [{
      url: 'https://mtgify.org',
    }],
  }, {
    label: 'mtgify.org/json',
    endpoints: [{
      url: 'https://mtgify.org/json/version.json',
      verify: verifyJson,
      // verify: verifyUpdated(json => json.updated),
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
    label: 'maryo',
    endpoints: [{
      url: 'https://maryo.mpaulweeks.com/health',
      verify: resp => {
        const percentUsed = resp.body.split('\n')[1].split(/\s+/)[4];
        return {
          ok: resp.status < 400,
          message: `${percentUsed} used`,
        };
      },
    }],
  }, {
    label: 'static.mpaulweeks.com',
    endpoints: [{
      url: 'https://static.mpaulweeks.com',
    }],
  }, {
    label: 'postboard.mpaulweeks.com',
    endpoints: [{
      url: 'https://postboard.mpaulweeks.com/health',
      verify: verifyJson,
    }],
  }, {
    label: 'archive',
    endpoints: [{
      url: 'https://s3.amazonaws.com/mpaulweeks-archive/data.json',
      verify: verifyUpdated(json => json.meta.updated),
    }],
  }, {
    label: 'animefight.club',
    endpoints: [{
      url: 'https://s3.amazonaws.com/sakuga/data/animefightclub.min.json',
      verify: verifyUpdated(json => json.meta.updated),
    }],
  }, {
    label: 'edh-obscurity.mpaulweeks.com',
    endpoints: [{
      url: 'https://s3.amazonaws.com/edh-obscurity/edh_deck_counts.json',
      verify: verifyUpdated(json => json.updated),
    }],
  }, {
    label: 'mpaulweeks.github.io/changepurse',
    endpoints: [{
      url: 'https://mpaulweeks.github.io/changepurse/price.json',
      verify: verifyUpdated(json => json.updated),
    }],
  }],
};

(async () => {
  new Updater().cron();
  new SmokeAlarm(config).start();
})();
