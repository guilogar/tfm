import {
  IonContent,
  IonHeader,
  IonPage,
  IonItem,
  IonIcon,
  IonLabel,
  IonList,
} from '@ionic/react';

import React, { useState, useEffect } from 'react';

import { getApi } from '../../../services/utils';
import { Redirect } from 'react-router';
import './SpecificHistoricPredictions.css';

import ToolBar from '../../../components/toolbar';
import { useTranslation } from 'react-i18next';

const SpecificHistoricPredictions: React.FC = (props: any) => {
  const { t } = useTranslation();
  const api = getApi();

  const [searchText, setSearchText] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const historicPredictionCategory = props.match.params.id;
      switch (historicPredictionCategory) {
        case 'Irrigates':
          {
          }
          break;
        case 'Phytosanitaries':
          {
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
      <IonContent></IonContent>
    </IonPage>
  );
};

export default SpecificHistoricPredictions;
