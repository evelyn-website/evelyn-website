const encoder = new TextEncoder();
const decoder = new TextDecoder();

function isSafeHref(href) {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("/") ||
    href.startsWith("#")
  );
}

function renderFacetedText(text, facets, keyPrefix) {
  if (!facets || facets.length === 0) {
    return text;
  }

  const bytes = encoder.encode(text);
  const sorted = [...facets].sort(
    (a, b) => a.index.byteStart - b.index.byteStart
  );

  const nodes = [];
  let cursor = 0;

  for (let i = 0; i < sorted.length; i++) {
    const facet = sorted[i];
    const { byteStart, byteEnd } = facet.index;
    const features = facet.features ?? [];

    if (byteStart > cursor) {
      nodes.push(decoder.decode(bytes.slice(cursor, byteStart)));
    }

    const segmentBytes = bytes.slice(byteStart, byteEnd);
    const segmentText = decoder.decode(segmentBytes);
    const key = `${keyPrefix}-facet-${i}`;

    let node = segmentText;
    for (const feature of features) {
      const type = feature.$type;
      if (type === "pub.leaflet.richtext.facet#link") {
        const href = feature.uri ?? "";
        if (isSafeHref(href)) {
          const isExternal =
            href.startsWith("http://") || href.startsWith("https://");
          node = (
            <a
              key={key}
              href={href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
            >
              {node}
            </a>
          );
        }
      } else if (type === "pub.leaflet.richtext.facet#bold") {
        node = <strong key={key}>{node}</strong>;
      } else if (type === "pub.leaflet.richtext.facet#italic") {
        node = <em key={key}>{node}</em>;
      } else if (type === "pub.leaflet.richtext.facet#code") {
        node = <code key={key}>{node}</code>;
      }
    }

    nodes.push(node);
    cursor = byteEnd;
  }

  if (cursor < bytes.length) {
    nodes.push(decoder.decode(bytes.slice(cursor)));
  }

  return nodes;
}

function renderBlock(block, index) {
  const type = block.$type;

  if (type === "pub.leaflet.blocks.text") {
    const content = renderFacetedText(
      block.plaintext ?? "",
      block.facets,
      `block-${index}`
    );
    return <p key={`block-${index}`}>{content}</p>;
  }

  if (type === "pub.leaflet.blocks.header") {
    const level = block.level ?? 2;
    const content = renderFacetedText(
      block.plaintext ?? "",
      block.facets,
      `block-${index}`
    );
    const Tag = `h${Math.min(Math.max(level, 1), 6)}`;
    return <Tag key={`block-${index}`}>{content}</Tag>;
  }

  if (type === "pub.leaflet.blocks.unorderedList") {
    const children = block.children ?? [];
    return (
      <ul key={`block-${index}`}>
        {children.map((item, i) => {
          const textBlock = item.content;
          if (!textBlock) return null;
          const content = renderFacetedText(
            textBlock.plaintext ?? "",
            textBlock.facets,
            `block-${index}-item-${i}`
          );
          return <li key={i}>{content}</li>;
        })}
      </ul>
    );
  }

  if (type === "pub.leaflet.blocks.horizontalRule") {
    return <hr key={`block-${index}`} />;
  }

  return null;
}

function LeafletRenderer({ doc }) {
  if (!doc) return null;

  const pages = doc.content?.pages ?? doc.pages ?? [];
  const elements = [];
  let blockIndex = 0;

  for (const page of pages) {
    const blocks = page.blocks ?? [];
    for (const blockWrapper of blocks) {
      const block = blockWrapper.block ?? blockWrapper;
      const el = renderBlock(block, blockIndex);
      if (el !== null) elements.push(el);
      blockIndex++;
    }
  }

  return <>{elements}</>;
}

export default LeafletRenderer;
