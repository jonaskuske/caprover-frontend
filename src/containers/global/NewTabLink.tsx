type Props = JSX.IntrinsicElements['a'] & {
    url?: string
    children?: React.ReactNode
}

export default function NewTabLink({ url, href, ...props }: Props) {
    href ??= url
    return (
        <a target="_blank" rel="noopener noreferrer" href={href} {...props} />
    )
}
