import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Noproductincart = () => {
  const history = useHistory();

  const handleShopNowClick = () => {
    history.push('/'); 
  };
    return (
      <>
      <div className="container">

        <div className="_1AtVbE col-12-12" style={{ display: 'block', width: '100%' }}>
          <div className="Vy94J0" style={{ textAlign: 'center', padding: '30px 0 36px', background: '#fff' }}>
          <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" className="_2giOt4" style={{ display: 'inline-block', height: '162px', textDecoration: 'none', color: 'inherit', border: 'none', outline: 'none', overflowClipMargin: 'content-box', overflow: 'clip' }} />
            <div className="_1LCJ1U" style={{ display: 'block', fontSize: '18px', marginTop: '24px' }}>Your cart is empty!</div>
            <div className="hKIFfL" style={{ display: 'block', fontSize: '12px', marginTop: '10px' }}>Add items to it now.</div>
            <button className="_2KpZ6l _1sbqEe _3dESVI" onClick={handleShopNowClick} style={{ fontSize: '14px', marginTop: '20px', fontWeight: '400', padding: '12px 72px', background: '#2874f0', color: '#fff', boxShadow: '0 2px 4px 0 rgba(0,0,0,.2)', border: 'none' }}>
              <span>Shop now</span>
            </button>
          </div>
        </div>
        </div>

      </>
    )
  }
  
  export default Noproductincart;