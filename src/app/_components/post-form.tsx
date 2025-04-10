"use client";

import { useState } from "react";

import { api } from "@/trpc/react";
import { Card } from "@/components/ui/card";
import { z } from "zod";

export function LatestPost() {
  const utils = api.useUtils();
  const [name, setName] = useState("");
  const createPost = api.posts.create.useMutation({
    onSuccess: async () => {
      await utils.posts.getAll.invalidate();
      setName("");
    },
  });

  return (
    <Card className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ name: name.trim() });
        }}
        className="flex gap-5 px-5"
      >
        <input
          type="text"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full bg-white/30 px-4 py-2 text-gray-100"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20 disabled:bg-pink-300"
          disabled={
            z.string().trim().min(1).safeParse(name).error !== undefined ||
            createPost.isPending
          }
        >
          {createPost.isPending ? (
            <>{"Submitting..."}</>
          ) : (
            <span className="icon-[mingcute--check-fill]" />
          )}
        </button>
      </form>
    </Card>
  );
}
