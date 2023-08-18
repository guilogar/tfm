import { XYPlot, LineSeries } from 'react-vis';

interface iGraph {
  IRRIGATES: Function;
  PHYTOSANITARIES: Function;
}

export const GRAPHS: iGraph = {
  IRRIGATES: (data = [], yDomain = []) => {
    return (
      <XYPlot height={300} width={300}>
        <LineSeries data={data} yDomain={yDomain} />
      </XYPlot>
    );
  },
  PHYTOSANITARIES: (data = []) => {
    return <></>;
  },
};
