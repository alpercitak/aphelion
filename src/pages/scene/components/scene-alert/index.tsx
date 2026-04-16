import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button';
import Text from '@/components/ui/text';
import styles from './index.module.css';

interface SceneAlertProps {
  text: string;
}

export default function SceneAlert({ text }: SceneAlertProps) {
  const navigate = useNavigate();

  return (
    <div className={styles['scene__alert']}>
      <Text family="mono" size="medium" className={styles['scene__alert-text']}>
        {text}
      </Text>
      <Button variant="tertiary" onClick={() => navigate('/')}>
        ← BACK
      </Button>
    </div>
  );
}
