import { Link } from 'remix';

type DataType = {
  id: string;
  image: string;
  name: string;
};
export interface CardsInterface {
  data: DataType[];
  title?: String;
}

export const Cards = ({ data, title }: CardsInterface) => {
  return (
    <div>
      {title && (
        <div className="content-section">
          <h1>{title}</h1>
        </div>
      )}

      <ul className="cards">
        {data && data.length ? (
          <>
            {data.map(({ id, image, name }: DataType, i: number) => (
              <li className="card" key={id + '-' + i}>
                <Link prefetch="intent" to={`/blogs/${id}`}>
                  <img src={image} />
                  <p>{name}</p>
                </Link>
              </li>
            ))}
          </>
        ) : (
          <li>Dannnng I haven't blogged anything. 🤦 </li>
        )}
      </ul>
    </div>
  );
};
