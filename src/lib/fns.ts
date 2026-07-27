export function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export interface RelatedEntry {
  id: string;
  collection: string;
  data: {
    title: string;
    description?: string;
    date: Date;
    topic?: string;
  };
}

export function getRelatedEntries(
  current: RelatedEntry,
  all: RelatedEntry[],
  count: number = 2,
): RelatedEntry[] {
  // 1. Exclude the current entry (match by id AND collection)
  const others = all.filter(
    (e) => !(e.id === current.id && e.collection === current.collection),
  );

  if (others.length === 0) return [];

  // 2. Group by strategy
  const sameTopic = others.filter(
    (e) =>
      e.collection === current.collection &&
      e.data.topic &&
      current.data.topic &&
      e.data.topic === current.data.topic,
  );

  const sameCollection = others.filter(
    (e) =>
      e.collection === current.collection &&
      // exclude entries already picked in sameTopic
      !sameTopic.includes(e),
  );

  const rest = others.filter(
    (e) => !sameTopic.includes(e) && !sameCollection.includes(e),
  );

  // 3. Build result – prefer same-topic, then same-collection, then rest
  const result: RelatedEntry[] = [];

  function takeFrom(pool: RelatedEntry[], n: number) {
    // Shuffle a copy to get pseudo-random selection
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
  }

  // Take up to `count` from same-topic
  const fromTopic = takeFrom(sameTopic, count);
  result.push(...fromTopic);

  // Fill remaining slots from same-collection
  if (result.length < count) {
    const fromCollection = takeFrom(sameCollection, count - result.length);
    result.push(...fromCollection);
  }

  // Fill remaining slots from rest
  if (result.length < count) {
    const fromRest = takeFrom(rest, count - result.length);
    result.push(...fromRest);
  }

  return result;
}
