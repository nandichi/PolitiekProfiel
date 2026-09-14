"use client";

import { useState } from "react";

type Status = "idle" | "deleting" | "deleted" | "error";

export function DeleteResultButton({ shareId }: { shareId: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function deleteProfile() {
    const confirmed = window.confirm(
      "Weet je zeker dat je dit resultaat permanent wilt verwijderen? De deelbare link werkt daarna niet meer.",
    );
    if (!confirmed) return;

    setStatus("deleting");
    try {
      const response = await fetch(`/api/r/${encodeURIComponent(shareId)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error("Delete failed");
      setStatus("deleted");
    } catch {
      setStatus("error");
    }
  }

  if (status === "deleted") {
    return (
      <p className="text-sm text-ink-2" role="status">
        Dit resultaat is verwijderd. De deelbare link werkt niet meer.
      </p>
    );
  }

  return (
    <div className="mt-8 border-t border-rule pt-6">
      <p className="kicker mb-2">Resultaat verwijderen</p>
      <p className="max-w-2xl text-sm text-ink-muted leading-relaxed">
        Verwijder dit resultaat met de link die je nu gebruikt. Dit wist het
        actieve resultaat en maakt de deelbare link onbruikbaar. Afbeeldingen of
        posts die al door externe platforms zijn gekopieerd, kunnen we niet
        terughalen.
      </p>
      <button
        type="button"
        onClick={deleteProfile}
        disabled={status === "deleting"}
        className="btn btn-ghost mt-4 border-terra text-terra hover:bg-terra hover:text-paper disabled:cursor-wait disabled:opacity-60"
      >
        {status === "deleting" ? "Resultaat verwijderen..." : "Verwijder dit resultaat"}
      </button>
      {status === "error" && (
        <p className="mt-3 text-sm text-terra" role="alert">
          Verwijderen is niet gelukt. Probeer het opnieuw of gebruik het contactformulier.
        </p>
      )}
    </div>
  );
}
