import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookIcon, PlusCircle } from "lucide-react";

export default async function BooksPage() {
  // Fetch books from the database
  const books = await prisma.book.findMany({
    orderBy: {
      title: "asc",
    },
  });

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Books Collection</h1>
        <Button asChild>
          <Link href="/books/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Book
          </Link>
        </Button>
      </div>

      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <BookIcon className="h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No books found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No books found in the library. Add your first book to get started.
          </p>
          <Button asChild className="mt-4">
            <Link href="/books/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Book
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="group overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                    {book.title}
                  </h2>
                  <p className="text-muted-foreground">By {book.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {book.publisher}, {book.publishYear}
                  </p>
                </div>

                <div className="flex items-center justify-between my-4">
                  <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full font-medium">
                    {book.category}
                  </span>
                  <span className="text-sm font-medium">
                    {book.stock} {book.stock === 1 ? "copy" : "copies"}{" "}
                    available
                  </span>
                </div>

                {book.description && (
                  <p className="text-muted-foreground text-sm line-clamp-2 flex-grow">
                    {book.description}
                  </p>
                )}

                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <Button variant="link" asChild className="p-0 h-auto">
                    <Link href={`/books/${book.id}`}>View Details</Link>
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    {book.isbn ? `ISBN: ${book.isbn}` : "No ISBN"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
