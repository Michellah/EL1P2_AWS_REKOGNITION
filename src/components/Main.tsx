import { useNavigate } from 'react-router-dom';
import './Main.css'

export default function Home() {
    const navigate = useNavigate();
    const goToSecondsComp = () => {
  
        // This will navigate to second component
        navigate('/second'); 
      };

  return (
    <>
    <div id='body'>
      <div className='title'>Facial recognition</div>
      <button onClick={ goToSecondsComp }>Go to test</button>
    </div>
    </>
  )
}
