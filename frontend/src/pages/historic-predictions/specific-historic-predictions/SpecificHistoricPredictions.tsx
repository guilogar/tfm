import {
  IonContent,
  IonHeader,
  IonPage,
  useIonLoading,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';

import React, { useState, useEffect } from 'react';

import { getApi } from '../../../services/utils';
import './SpecificHistoricPredictions.css';

import ToolBar from '../../../components/toolbar';
import { useTranslation } from 'react-i18next';

import { GRAPHS } from './get-graphs';

import { getMonthToRest } from '../../../services/utils';
import {
  LAST_MONTHS_OPTIONS,
  NEXT_MONTHS_OPTIONS,
  tLastNeextMonthsNumeric,
} from '../../../services/constants';

const SpecificHistoricPredictions: React.FC = (props: any) => {
  const { t } = useTranslation();
  const api = getApi();

  const [present, dismiss] = useIonLoading();
  const [results, setResults] = useState<any>(<></>);
  const [startDateOption, setStartDateOption] =
    useState<tLastNeextMonthsNumeric>('LAST_ONE_MONTH');
  const [endDateOption, setEndDateOption] =
    useState<tLastNeextMonthsNumeric>('NEXT_ONE_MONTH');

  const filterData = async ({
    startDate = '',
    endDate = '',
    farmName = '',
    orderBy = 'createdAt',
    orderDirection = 'ASC',
  } = {}) => {
    const { data } = await api.get(
      `/irrigate` +
        `?startDate=${startDate}` +
        `&endDate=${endDate}` +
        `&farmName=${farmName}` +
        `&orderBy=${orderBy}` +
        `&orderDirection=${orderDirection}`
    );
    return data.irrigates;
  };

  const filterPredictedData = async ({
    startDate = '',
    endDate = '',
    farmName = '',
    orderBy = 'date',
    orderDirection = 'ASC',
  } = {}) => {
    const { data } = await api.get(
      `/irrigate-predictions` +
        `?startDate=${startDate}` +
        `&endDate=${endDate}` +
        `&farmName=${farmName}` +
        `&orderBy=${orderBy}` +
        `&orderDirection=${orderDirection}`
    );
    return data.irrigatesPredicted;
  };

  useEffect(() => {
    (async () => {
      const historicPredictionCategory = props.match.params.id;
      const farmName = props.match.params.farmName;
      switch (historicPredictionCategory) {
        case 'IRRIGATES':
          {
            await present({
              message: t('WAIT'),
            });

            const endDate = new Date();
            const startDate = new Date();
            startDate.setMonth(
              endDate.getMonth() + getMonthToRest(startDateOption)
            );
            const irrigates = [
              ...(await filterData({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                farmName: farmName,
                orderBy: 'createdAt',
                orderDirection: 'ASC',
              })),
            ];
            let data = [];
            let irrigateCounter = 0;
            let maxWater = 0;
            for (const irrigate of irrigates) {
              if (irrigate.amountWater > maxWater) {
                maxWater = irrigate.amountWater;
              }
              data.push({ x: irrigateCounter++, y: irrigate.amountWater });
            }

            const today = new Date();
            const targetDate = new Date();
            targetDate.setMonth(
              today.getMonth() + getMonthToRest(endDateOption)
            );
            const irrigatesPredicted = [
              ...(await filterPredictedData({
                startDate: today.toISOString(),
                endDate: targetDate.toISOString(),
                farmName: farmName,
                orderBy: 'date',
                orderDirection: 'ASC',
              })),
            ];
            let dataPredicted = [];
            let irrigatePredictedCounter = 0;
            for (const irrigatePreditec of irrigatesPredicted) {
              if (irrigatePreditec.amountWater > maxWater) {
                maxWater = irrigatePreditec.amountWater;
              }
              dataPredicted.push({
                x: irrigatePredictedCounter++,
                y: irrigatePreditec.amountWater,
              });
            }

            setResults(
              GRAPHS.IRRIGATES({
                data: data,
                dataPredicted: dataPredicted,
                yDomain: [0, maxWater],
                noDataMessage: t(
                  'SPECIFIC_HISTORIC_PREDICTIONS_NO_DATA_EXISTS'
                ),
              })
            );
            await dismiss();
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
  }, [startDateOption, endDateOption]);

  return (
    <IonPage>
      <IonHeader>
        <ToolBar
          title={
            t('HISTORIC_PREDICTIONS_LIST') +
            ' / ' +
            t('IRRIGATES') +
            ' - ' +
            props?.match?.params?.farmName
          }
          writeAction={() => {}}
          cancelAction={() => {}}
          CreateButton={null}
          showIconSearch={false}
        />
      </IonHeader>
      <IonContent>
        <IonSelect
          placeholder={t(
            'SPECIFIC_HISTORIC_PREDICTIONS_CHOOSE_HISTORIC_INTERVAL'
          )}
          title={t('SPECIFIC_HISTORIC_PREDICTIONS_CHOOSE_HISTORIC_INTERVAL')}
          value={startDateOption}
          onIonChange={(e) => {
            setStartDateOption(e.detail.value);
          }}
        >
          {LAST_MONTHS_OPTIONS.map((key, index) => (
            <IonSelectOption value={key} key={index}>
              {t(`SPECIFIC_HISTORIC_PREDICTIONS_${key}`)}
            </IonSelectOption>
          ))}
        </IonSelect>
        <IonSelect
          placeholder={t(
            'SPECIFIC_HISTORIC_PREDICTIONS_CHOOSE_PREDICTION_INTERVAL'
          )}
          title={t('SPECIFIC_HISTORIC_PREDICTIONS_CHOOSE_PREDICTION_INTERVAL')}
          value={endDateOption}
          onIonChange={(e) => {
            setEndDateOption(e.detail.value);
          }}
        >
          {NEXT_MONTHS_OPTIONS.map((key, index) => (
            <IonSelectOption value={key} key={index}>
              {t(`SPECIFIC_HISTORIC_PREDICTIONS_${key}`)}
            </IonSelectOption>
          ))}
        </IonSelect>
        {results}
      </IonContent>
    </IonPage>
  );
};

export default SpecificHistoricPredictions;
