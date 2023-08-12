import { IonContent, IonHeader, IonPage, useIonLoading } from '@ionic/react';

import React, { useState, useEffect } from 'react';

import { getApi } from '../../../services/utils';
import './SpecificHistoricPredictions.css';

import ToolBar from '../../../components/toolbar';
import { useTranslation } from 'react-i18next';

import { GRAPHS } from './get-graphs';

const SpecificHistoricPredictions: React.FC = (props: any) => {
  const { t } = useTranslation();
  const api = getApi();

  const [present, dismiss] = useIonLoading();

  const [months, setMonths] = useState<number>(0);

  const [results, setResults] = useState<any>(<></>);

  const getIrrigates = async () => {
    const { data } = await api.get('/irrigate');
    return data.irrigates;
  };

  const filterData = async (text: string) => {
    if (!text) {
      return await getIrrigates();
    }
    const { data } = await api.get(`/irrigate?filter=${text}`);
    return data.irrigates;
  };

  useEffect(() => {
    (async () => {
      const historicPredictionCategory = props.match.params.id;
      switch (historicPredictionCategory) {
        case 'IRRIGATES':
          {
            await present({
              message: t('WAIT'),
            });
            const irrigates = [
              ...(await filterData('2023-07')),
              ...(await filterData('2023-08')),
            ];
            let data = [];
            let x = 0;
            let maxWater = 0;
            for (const irrigate of irrigates) {
              if (irrigate.amountWater > maxWater) {
                maxWater = irrigate.amountWater;
              }
              data.push({ x: x++, y: irrigate.amountWater });
            }
            await dismiss();
            setResults(GRAPHS.IRRIGATES(data, [0, maxWater]));
          }
          break;
        case 'PHYTOSANITARIES':
          {
            await present({
              message: t('WAIT'),
            });
            await dismiss();
          }
          break;
      }
    })();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <ToolBar
          title={t('HISTORIC_PREDICTIONS_LIST')}
          writeAction={() => {}}
          cancelAction={() => {}}
          CreateButton={null}
        />
      </IonHeader>
      <IonContent>{results}</IonContent>
    </IonPage>
  );
};

export default SpecificHistoricPredictions;
