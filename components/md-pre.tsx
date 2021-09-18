import dynamic from "next/dynamic";

const HttpRequest = dynamic(() => import("./http-request/http-request"));
const HttpResponse = dynamic(() => import("./http-response/http-response"));
const OpenGraph = dynamic(() => import("./open-graph"));
const CodeHighlight = dynamic(() => import("./prism"));
const Flowchart = dynamic(() => import("./flowchart"));

const re = /((\w+)=(\w+|"[\w+ -]+"))/gi;

const parseMetaString = (str: string | undefined): Types.Dict => {
  if (str === undefined) return {};
  const matches = str.split(re);
  return matches.reduce((acc, el) => {
    if (!el.includes("=")) {
      return acc;
    }
    const [property, ...values] = el.split("=");
    return {
      ...acc,
      [property]: values
        .join()
        .replace(/^("|')/, "")
        .replace(/("|')$/, "")
        .trim(),
    };
  }, {});
};

export const MdPre = (props: any) => {
  const componentProps = props.children.props;
  const language = /\w+-(\w+)/.exec(componentProps.className)?.[1];
  const metaProps = parseMetaString(componentProps.metastring);
  const type = metaProps.type;

  if (language === undefined)
    return (
      <pre className="block w-full border border-gray-100">
        <code>{componentProps.children}</code>
      </pre>
    );

  if (language === "chart") return <Flowchart code={componentProps.children} />;

  if (type === "request") return <HttpRequest curl={componentProps.children} />;

  if (type === "response") return <HttpResponse />;

  if (type === "ogp" && language === "ogp")
    return (
      <OpenGraph
        {...metaProps}
        className={metaProps.className}
        url={`${componentProps.children.replace("\n", "").trim()}`}
      />
    );

  return <CodeHighlight code={componentProps.children.replace(/\n$/, "").replace(/^\n/, "")} language={language} />;
};

export default MdPre;
