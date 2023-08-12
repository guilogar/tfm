import { Route } from 'react-router-dom';
import HistoricPredictions from '../historic-predictions/HistoricPredictions';
import SpecificHistoricPredictions from '../historic-predictions/specific-historic-predictions/SpecificHistoricPredictions';

let index = 0;
export default [
  <Route path="/dashboard/page/HistoricPredictions" exact={true} key={index++}>
    <HistoricPredictions />
  </Route>,
  <Route
    path="/dashboard/page/HistoricPredictions/:id"
    key={index++}
    exact={true}
    component={SpecificHistoricPredictions}
  ></Route>,
];
