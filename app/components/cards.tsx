type DataType = {
  id: string;
  image: string;
  name: string;
};
export interface CardsInterface {
  data: DataType[];
}

export const Cards = ({ data }: CardsInterface) => {
  return (
    <ul className="cards">
      {data &&
        data.map(({ id, image, name }: DataType, i: number) => (
          <li className="card" key={id + '-' + i}>
            <img src={image} />
            <p>{name}</p>
          </li>
        ))}
    </ul>
  );
};
