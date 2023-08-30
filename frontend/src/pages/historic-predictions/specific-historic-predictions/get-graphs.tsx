import { XYPlot, LineSeries, YAxis } from 'react-vis';
import { IonItem } from '@ionic/react';

interface iGraph {
  IRRIGATES: Function;
  PHYTOSANITARIES: Function;
}

export const GRAPHS: iGraph = {
  IRRIGATES: ({
    data = [],
    dataPredicted = [],
    yDomain = [],
    noDataMessage = '',
  }) => {
    return (
      <div className={'linesGraph'}>
        <XYPlot height={300} width={300}>
          <LineSeries
            data={data}
            yDomain={yDomain}
            color={'rgb(18, 147, 154)'}
          />
          <YAxis />
        </XYPlot>
        {dataPredicted.length > 0 && (
          <XYPlot height={300} width={300}>
            <LineSeries data={dataPredicted} yDomain={yDomain} color={'red'} />
            <YAxis />
          </XYPlot>
        )}
        {dataPredicted.length === 0 && <IonItem>{noDataMessage}</IonItem>}
      </div>
    );
  },
  PHYTOSANITARIES: (data = []) => {
    return <></>;
  },
};
