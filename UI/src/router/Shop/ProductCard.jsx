import React from 'react'
import productimg from "./images/image 5 (1).png"
import png360 from "./images/360.png"
import usflag from "./images/USA_Flag_icon.png"
import vectorimg from "./images/Vector.png"
import { useProductState } from './context/ProductContext'
import videoimg from "./images/Group.png"
import "./style.css"
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { Stack } from 'react-bootstrap'
import { Rating } from '@mui/material'

const ProductCard = (props) => {
  const { item } = props
  const { title, short_description } = item
  const { handleaddtocard, handleExploreClicks, handleSocialmedia, handleVideomodal } = useProductState();
  const history = useHistory()
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return (
    <>
      <div style={{
        marginRight: '5px',
        marginLeft: "5px"
      }}>
        <div className="mb-4 border border-success card-container" style={{ maxWidth: '225px', margin: "auto" }}>
          <div className="d-flex mx-auto h-100">
            <div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <img src={import.meta.env.VITE_APP_BASE_API + item.images[0]} className="text-center m-2 img-fluid" alt="#" />
              </div>              <div className="card-content mx-2">
                <h3 className="product-title" style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '20px', marginTop: '13px' }}><strong>{title}</strong></h3>
                <div>
                  <p className="product-description" style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {short_description}
                  </p>
                </div>
                <div className='d-flex flex-row align-items-center'>
                  <h5>Origin County:</h5>
                  <img src={usflag} alt="#" className='my-auto' />
                </div>
                <div className="product-actions">
                  <div className='d-flex flex-row '>
                    {item.zipFile_url && <div className="mr-3">
                      <img
                        src={png360}
                        alt="png360"
                        onClick={() => handleExploreClicks(item)}
                        data-toggle="modal"
                        data-target="#explore360Modal"
                        style={{ cursor: 'pointer' }}
                      />
                    </div>}
                    <div>
                      <div className="mr-3">
                        <img alt='vector' src={vectorimg}
                          onClick={() => handleSocialmedia(item)}
                          data-toggle="modal"
                          data-target="#socialmedia"
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                    </div>
                    {item.video_url && <div>
                      <div className="mr-3">
                        <img alt='vector' src={videoimg}
                          onClick={() => handleVideomodal(item)}
                          data-toggle="modal"
                          data-target="#videomodal"
                          style={{ cursor: 'pointer', width: "22px", height: "20p" }}
                        />
                      </div>
                    </div>}
                  </div>
                </div>
                <div>
                  <h3 className="text-center">{formatter.format(item.price)}</h3>
                </div>
                <div className="d-grid gap-3 mt-1">
                  <button
                    className="btn btn-success btn-block"
                    onClick={() => handleaddtocard(item)}
                    data-target="#myModal2"
                    data-toggle="modal"
                  >
                    Add to cart
                  </button>
                  <button
                    className="btn btn-white btn-block border border-success mb-1"
                    onClick={() => history.push(`/productdetail/${item._id}`)}
                    data-toggle="modal"
                    data-target="#exploreModal"
                  >
                    Explore
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Stack spacing={1}>
                          <Rating name="half-rating-read" defaultValue={item.rating} precision={0.5} readOnly />
                        </Stack>
                      </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default ProductCard