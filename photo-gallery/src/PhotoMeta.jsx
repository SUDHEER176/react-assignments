// "Author: Name" plus the contact-sheet line: frame number and original size.
// picsum gives an author and a size; the backup feed only has a title.
export default function PhotoMeta({ photo }) {
  const frame = `No. ${String(photo.number).padStart(4, '0')}`;
  const size = photo.width ? `${photo.width} × ${photo.height}` : null;

  return (
    <>
      <p className="author">
        <span className="author-label">{photo.author ? 'Author: ' : 'Title: '}</span>
        {photo.author || photo.title}
      </p>
      <span className="frame-number">{size ? `${frame} · ${size}` : frame}</span>
    </>
  );
}
