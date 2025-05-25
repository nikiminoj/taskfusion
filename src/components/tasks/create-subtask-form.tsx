"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { task_status } from "@/server/db/schema";

interface CreateSubtaskFormProps {
  parentTaskId: string;
  onSuccess?: () => void; // Optional callback for success
  onCancel?: () => void; // Optional callback for cancel
}

  parentTaskId,
  onSuccess,
  onCancel
}: CreateSubtaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<typeof task_status.enumValues[number]>(
    "todo"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/tasks/create-subtask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          status,
          parentTaskId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create subtask");
      }

      // Optionally clear the form or close the modal
      setTitle("");
      setStatus("todo");

      onSuccess?.(); // Call success callback

      // Handle successful creation (e.g., show a toast, refresh task list)
      console.log("Subtask created successfully!");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      console.error("Error creating subtask:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={status}
          onValueChange={(value: typeof task_status.enumValues[number]) =>
            setStatus(value)
          }
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {task_status.enumValues.map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Subtask"}
        </Button>
      </div>
    </form>
  );
}