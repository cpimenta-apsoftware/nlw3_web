import {
  cleanEnv, port, str,
} from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
      REACT_APP_MAPBOX_TOKEN: str(),      
  });
}

export default validateEnv; 