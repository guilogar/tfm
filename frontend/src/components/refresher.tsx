import {
  IonItem,
  IonRefresher,
  IonRefresherContent,
  IonToast,
} from '@ionic/react';
import React, { useState, useRef } from 'react';

import { useTranslation } from 'react-i18next';

const Refresher: React.FC<{ refreshAction: Function }> = ({
  refreshAction,
}) => {
  const { t } = useTranslation();

  const [showCompleteToast, setShowCompleteToast] = useState<boolean>(false);
  const ionRefresherRef = useRef<HTMLIonRefresherElement>(null);

  const doRefresh = async () => {
    ionRefresherRef.current!.complete();
    await refreshAction();
    setShowCompleteToast(true);
  };

  return (
    <div>
      <IonRefresher slot="fixed" ref={ionRefresherRef} onIonRefresh={doRefresh}>
        <IonRefresherContent />
      </IonRefresher>
      <IonToast
        isOpen={showCompleteToast}
        message={t('REFRESHER_UPDATE_COMPLETED')}
        duration={2000}
        onDidDismiss={() => setShowCompleteToast(false)}
      />
      <IonItem lines="none"></IonItem>
      <IonItem lines="none"></IonItem>
    </div>
  );
};

export default Refresher;
