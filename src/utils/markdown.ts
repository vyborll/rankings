import { serialize } from 'next-mdx-remote/serialize';

export const renderMarkdown = async (content: string) => {
	return serialize(content ?? '');
};
