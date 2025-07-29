'use client'

import { Container } from 'react-bootstrap'

interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular'
  width?: string | number
  height?: string | number
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  variant = 'rectangular', 
  width = '100%', 
  height = '1rem',
  className = ''
}) => {
  const baseClass = 'skeleton-loading'
  const variantClass = `skeleton-${variant}`
  
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  return (
    <div 
      className={`${baseClass} ${variantClass} ${className}`} 
      style={style}
    />
  )
}

export const ProjectCardSkeleton = () => (
  <div className="card d-block">
    <Skeleton variant="rectangular" height="300px" className="card-img" />
    <div className="card-body">
      <Skeleton variant="text" width="60%" height="0.875rem" className="mb-2" />
      <Skeleton variant="text" width="80%" height="1.5rem" />
    </div>
  </div>
)

export const ProjectsGridSkeleton = () => (
  <Container>
    <div className="card-columns card-columns-3 d-block">
      {Array.from({ length: 6 }).map((_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </div>
  </Container>
)

export const CarouselSkeleton = () => (
  <div className="mb-5 m-auto" style={{ width: "97vw", maxWidth: "1500px" }}>
    <Skeleton variant="rectangular" height="400px" />
  </div>
)

export const PageSkeleton = () => (
  <Container>
    <Skeleton variant="text" width="40%" height="3rem" className="mx-auto mb-4" />
    <div className="row mb-5">
      <div className="col-md">
        <Skeleton variant="rectangular" height="400px" />
      </div>
      <div className="col">
        <Container>
          <Skeleton variant="text" width="100%" className="mb-3" />
          <Skeleton variant="text" width="95%" className="mb-3" />
          <Skeleton variant="text" width="85%" className="mb-3" />
          <Skeleton variant="text" width="90%" />
        </Container>
      </div>
    </div>
  </Container>
)