import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

const ALLOWED_ELEMENTS = ["a", "em", "strong", "p", "code"];

const Markdown = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeSanitize]}
      remarkPlugins={[remarkGfm]}
      className={className}
      components={{
        strong: ({ node, ...props }) => <strong className="b" {...props} />,
        // add 0 padding and margin to <p> elements to fix spacing bug
        p: ({ node, ...props }) => <p {...props} className="ma0 pa0" />,
      }}
      allowedElements={ALLOWED_ELEMENTS}
    >
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;
