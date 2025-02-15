module.exports = args => {

  args = args.map(a => a.trim()).filter(Boolean);

  const env = {};
  const cmd = [];

  let envDone;
  let lastEnv;
  for (const arg of args) {
    if (envDone) {
      cmd.push(arg);
    } else if (lastEnv) {
      let value = arg;
      if (value.endsWith(`'`)) {
        value = value.substr(0, value.length - 1);
        env[lastEnv] += ' ' + value
        lastEnv = undefined;
      } else {
        env[lastEnv] += ' ' + value
      }
    } else if (!arg.match(/=/)) {
      envDone = true;
      cmd.push(arg);
    } else {
      let [envVar, value] = arg.split('=');
      if (!envVar || !value) {
        exit(`Invalid env var:`, arg);
        return;
      } else {
        if (value.startsWith(`'`)) {
          if (value.endsWith(`'`)) {
            value = value.substring(1, value.length - 1);
          } else {
            value = value.substr(1);
            lastEnv = envVar;
          }
        }
        env[envVar] = value;
      }
    }
  }

  return { env, cmd };
}
