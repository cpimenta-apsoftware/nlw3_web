import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Navegacao from './pages/Navegacao';
import MapaOrfanatos from './pages/MapaOrfanatos';
import Orfanato from './pages/Orfanato';
import CriarOrfanato from './pages/CriarOrfanato';

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Navegacao} />
        <Route path="/app" component={MapaOrfanatos} />        
        <Route path="/orfanatos/criar" component={CriarOrfanato} />
        <Route path="/orfanatos/:id" component={Orfanato} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;