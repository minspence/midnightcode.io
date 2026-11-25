import { defineType, defineField, defineArrayMember } from 'sanity'

export const project = defineType({
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                defineField({
                    name: 'alt',
                    title: 'Alternative text',
                    type: 'string',
                    description: 'Describe the image for screen readers and SEO',
                    validation: (rule) =>
                        rule.required().warning('Alt text is important for accessibility and SEO'),
                }),
            ],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
            validation: (rule) => rule.required().max(300),
        }),
        defineField({
            name: 'stack',
            title: 'Tech stack',
            type: 'array',
            of: [defineArrayMember({ type: 'string' })],
            options: { layout: 'tags' },
            description: 'Technologies used, shown as tags on the project card (e.g. Next.js, Sanity)',
            validation: (rule) => rule.max(8).unique(),
        }),
        defineField({
            name: 'liveUrl',
            title: 'Live Site URL',
            type: 'url',
        }),
        defineField({
            name: 'repoUrl',
            title: 'Repository URL',
            type: 'url',
            description: 'Link to the source code (e.g. GitHub)',
            validation: (rule) => rule.uri({ scheme: ['https'] }),
        }),
        defineField({
            name: 'featured',
            title: 'Featured',
            type: 'boolean',
            description: 'Show this project in the Featured section on the homepage',
            initialValue: false,
        }),
        defineField({
            name: 'order',
            title: 'Order',
            type: 'number',
            description: 'Lower numbers appear first',
        }),
    ],
    orderings: [
        {
            title: 'Manual Order',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
    ],
    preview: {
        select: {
            title: 'title',
            media: 'image',
        },
    },
})