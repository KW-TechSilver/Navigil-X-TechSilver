import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getTimeAdjustment } from 'rafaelComponents/MapTool/Utils/Utils';

const useTimezoneAdjustment = (unit = 's') => {
  const [timeAdjustment, setTimeAdjustment] = useState(0);
  const coordinate = useSelector(store => store.targetLastKnownCoords);

  useEffect(() => {
    setTimeAdjustment(getTimeAdjustment(coordinate, unit));
  }, [coordinate, unit]);
  return timeAdjustment;
};

export default useTimezoneAdjustment;
