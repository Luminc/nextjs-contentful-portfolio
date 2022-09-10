import  * as React from 'react'
import Carousel from 'react-bootstrap/Carousel';
import { Link, GatsbyImage} from 'gatsby';

const Car = ({data}) => {

return (
    <Carousel pause={false} indicators={false} className="mb-5">
    {data.map(image => (
        <Carousel.Item>
          <Link 
          to={`/projects/departure-arrival-return`}
          >
            <GatsbyImage
              className="d-block w-100"
              image={image.node.image.gatsbyImageData}
              alt=""
            />
            </Link>
        </Carousel.Item>
      ))}
    </Carousel>
)
}

export default Car