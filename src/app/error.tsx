"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container section empty-state">
      <h1>We couldn’t load this page.</h1>
      <p>Please try again, or call Dogra Sports on +91 97363 25100.</p>
      <button className="button button-red" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
