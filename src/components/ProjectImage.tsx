import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import type { ProjectCardData } from '@/components/ProjectCard'

/**
 * 16:9 frame for a project image.
 * - Screenshots (about 4:3 to 2:1) fill the frame.
 * - Logos and odd aspect ratios are centered at no more than their natural
 *   size, so they are never cropped or upscaled into a blur.
 */
export function ProjectImage({
                                 image,
                                 title,
                                 eager = false,
                                 sizes,
                             }: {
    image: NonNullable<ProjectCardData['image']>
    title: string | null
    eager?: boolean
    sizes: string
}) {
    const dims = image.asset?.metadata?.dimensions
    const ratio = dims?.aspectRatio ?? null
    const lqip = image.asset?.metadata?.lqip ?? undefined
    const alt = image.alt ?? title ?? ''
    const fitsFrame = ratio !== null && ratio >= 1.2 && ratio <= 2.2

    if (!fitsFrame && dims?.width && dims?.height) {
        const url = urlFor(image).width(dims.width).fit('max').auto('format').url()
        return (
            <div className="flex aspect-video items-center justify-center bg-black/60 p-6">
                <Image
                    src={url}
                    alt={alt}
                    width={dims.width}
                    height={dims.height}
                    sizes={`${dims.width}px`}
                    loading={eager ? 'eager' : 'lazy'}
                    placeholder={lqip ? 'blur' : 'empty'}
                    blurDataURL={lqip}
                    className="h-auto w-full"
                    style={{ maxWidth: dims.width }}
                />
            </div>
        )
    }

    const url = urlFor(image).width(1600).fit('max').auto('format').url()
    return (
        <div className="relative aspect-video bg-black/60">
            <Image
                src={url}
                alt={alt}
                fill
                sizes={sizes}
                loading={eager ? 'eager' : 'lazy'}
                placeholder={lqip ? 'blur' : 'empty'}
                blurDataURL={lqip}
                className="object-cover"
            />
        </div>
    )
}
