import {
  IonContent,
  IonHeader,
  IonPage,
  IonItem,
  IonIcon,
  IonLabel,
  IonList,
} from '@ionic/react';
import {
  eyedropOutline,
  eyedropSharp,
  rainyOutline,
  rainySharp,
} from 'ionicons/icons';

import React, { useState, useEffect } from 'react';

import { getApi } from '../../services/utils';
import { Redirect } from 'react-router';
import './HistoricPredictions.css';

import ToolBar from '../../components/toolbar';
import { useTranslation } from 'react-i18next';

const HistoricPreditions: React.FC = () => {
  const { t } = useTranslation();
  const api = getApi();

  const [farmableLands, setFarmableLands] = useState<Array<any>>([]);

  const getFarms = async () => {
    const { data } = await api.get('/farmableLand');
    return data.lands;
  };

  useEffect(() => {
    (async () => {
      const farms = await getFarms();
      setFarmableLands(farms);
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
          showIconSearch={false}
        />
      </IonHeader>
      <IonContent>
        <IonList>
          {farmableLands.map((farmableLand, index) => {
            return (
              <IonItem
                className={''}
                routerLink={
                  '/dashboard/page/HistoricPredictions/IRRIGATES/' +
                  farmableLand.name
                }
                routerDirection="none"
                lines="none"
                detail={false}
                key={index}
              >
                <IonIcon slot="start" ios={rainyOutline} md={rainySharp} />
                <IonLabel>
                  {t('IRRIGATES')} - {farmableLand.name}
                </IonLabel>
              </IonItem>
            );
          })}

          {/* <IonItem
            className={''}
            routerLink={'/dashboard/page/HistoricPredictions/PHYTOSANITARIES'}
            routerDirection="none"
            lines="none"
            detail={false}
          >
            <IonIcon slot="start" ios={eyedropOutline} md={eyedropSharp} />
            <IonLabel>{t('PHYTOSANITARYS')}</IonLabel>
          </IonItem> */}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default HistoricPreditions;
