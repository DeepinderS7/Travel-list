import React, { useState } from "react";

export default function App() {
  const [items, setItems] = useState([]);

  function handleAdditem(newItem) {
    setItems(() => [...items, newItem]);
  }

  function handleDeleteItems(id) {
    setItems(() => items.filter((item) => item.id !== id));
  }

  function handlePackedItems(id) {
    setItems(() =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function handleClear() {
    setItems(() => []);
  }

  return (
    <div className="app">
      <Logo />
      <Form items={items} onAddItem={handleAdditem} />
      <PackageList
        items={items}
        onDeleteItems={handleDeleteItems}
        onPackedItem={handlePackedItems}
        onClear={handleClear}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>🌴 Far Away 💼</h1>;
}

function Form({ items, onAddItem }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return;

    const newItem = {
      id: Date.now(),
      description: description,
      packed: false,
      quantity: quantity,
    };

    onAddItem(newItem);

    setDescription(() => "");
    setQuantity(() => 1);
  }
  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your 😍 trip?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>ADD</button>
    </form>
  );
}

function PackageList({ items, onDeleteItems, onPackedItem, onClear }) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;

  if (sortBy === "input") sortedItems = items;
  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            onDeleteItems={onDeleteItems}
            onPackedItem={onPackedItem}
            key={item.id}
          />
        ))}
      </ul>

      <div className="actions">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(() => e.target.value)}
        >
          <option value="packed">Sort by packed Status</option>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
        </select>
        <button onClick={onClear}>Clear All</button>
      </div>
    </div>
  );
}

function Item({ item, onDeleteItems, onPackedItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onPackedItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItems(item.id)}>❌</button>
    </li>
  );
}

function Stats({ items }) {
  const numItems = items.length;
  const numPacked = items.reduce(
    (acc, curr) => (curr.packed ? acc + 1 : acc),
    0
  );

  const packedPercent = Math.round((numPacked / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        You have {numItems} items in your bag and you have already packed{" "}
        {numPacked} ({packedPercent}%)
      </em>
    </footer>
  );
}
