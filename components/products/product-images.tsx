"use client"

import Image from "next/image"

interface ProductImagesProps {
  imageURL: string
  productName: string
}

export function ProductImages({ imageURL, productName }: ProductImagesProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        <Image
          src={imageURL}
          alt={productName}
          fill
          className="object-cover"
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
    </div>
  )
}
