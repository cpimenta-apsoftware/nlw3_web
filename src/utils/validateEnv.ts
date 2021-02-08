import {
  cleanEnv, email, EnvError, EnvMissingError, json, makeValidator, str, testOnly,
} from 'envalid';

const duasLetras = makeValidator(x => {
  if (/^[A-Za-z]{2}$/.test(x)) return x.toUpperCase()
  else throw new Error('Esperado duas letras')
});

export const environmentVariables = cleanEnv(process.env, {
  REACT_APP_MAPBOX_TOKEN: str({ desc: 'token de acesso à API do MAPBOX' }),
  ADMIN_EMAIL: email({ default: 'cpimenta.apsoftware@gmail.com' }),
  EMAIL_CONFIG_JSON: json({ desc: 'parâmetros adicionais do e-mail'}),
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  INICIAIS: duasLetras({ devDefault: testOnly('CM') })
},
  {
    reporter: ({ errors, env }) => {      
      console.log(Object.values(errors));
      console.log('Variáveis de ambiente inválidas: ' + Object.keys(errors));
      Object.values(errors).forEach(err => {
        if (err instanceof EnvError) {
          console.log('EnvError: ' + err.message);
        } else if (err instanceof EnvMissingError) {
          console.log('EnvMissingError: ' + err.message);
        } else if (err instanceof TypeError) {
          console.log('TypeError: ' + err.message);
        } else {
          console.log('Outros: ' + err);
        }
      });
    }
  }
);

export type EnvironmentVariables = typeof environmentVariables;