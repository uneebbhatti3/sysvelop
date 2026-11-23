"use client";

import Link from "next/link";
// Adapted from the shadcn dashboard-01 block (data-table): same table, pagination, drawer and
// menu patterns, rebuilt around real enquiries. Drag-to-reorder was removed (it has no meaning
// for an inbox). Every value is rendered as text; React escapes it.

import * as React from "react";
import {
  FlexRender,
  columnVisibilityFeature,
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type SortingState,
} from "@tanstack/react-table";
import { toast } from "sonner";
import {
  ArrowUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  EllipsisVerticalIcon,
  MailIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import { deleteEnquiry, setStatus } from "@/app/admin/actions";
import type { Enquiry } from "@/lib/enquiries";
import { enquiryStatuses, type EnquiryStatus } from "@/lib/schema";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const statusLabel: Record<EnquiryStatus, string> = { new: "New", contacted: "Contacted", closed: "Closed" };
const statusItems = enquiryStatuses.map((s) => ({ value: s, label: statusLabel[s] }));
const statusDot: Record<EnquiryStatus, string> = {
  new: "bg-signal",
  contacted: "bg-amber-500",
  closed: "bg-muted-foreground/50",
};

const features = tableFeatures({
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature,
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
});

const col = createColumnHelper<typeof features, Enquiry>();

const dateFmt = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const replyHref = (e: Enquiry) =>
  `mailto:${encodeURIComponent(e.email)}?subject=${encodeURIComponent("Re: your enquiry to Sysvelop")}`;

type Action = { type: "status"; id: string; status: EnquiryStatus } | { type: "delete"; id: string };

export function EnquiriesTable({ enquiries, total }: { enquiries: Enquiry[]; total?: number }) {
  const [items, apply] = React.useOptimistic(enquiries, (state: Enquiry[], a: Action) =>
    a.type === "delete" ? state.filter((e) => e.id !== a.id) : state.map((e) => (e.id === a.id ? { ...e, status: a.status } : e)),
  );
  const [, startTransition] = React.useTransition();
  const [filter, setFilter] = React.useState<"all" | EnquiryStatus>("all");
  const [query, setQuery] = React.useState("");
  const [viewingId, setViewingId] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  const counts = React.useMemo(() => {
    const c = { all: items.length, new: 0, contacted: 0, closed: 0 };
    for (const e of items) c[e.status]++;
    return c;
  }, [items]);

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (e) =>
        (filter === "all" || e.status === filter) &&
        (!q || [e.name, e.email, e.company, e.message].some((v) => v.toLowerCase().includes(q))),
    );
  }, [items, filter, query]);

  const updateStatus = React.useCallback(
    (id: string, status: EnquiryStatus) =>
      startTransition(async () => {
        apply({ type: "status", id, status });
        const ok = await setStatus(id, status).then((r) => r.ok, () => false);
        if (ok) toast.success(`Marked ${statusLabel[status]}`);
        else toast.error("Could not update the status");
      }),
    [apply],
  );

  const remove = (id: string) =>
    startTransition(async () => {
      apply({ type: "delete", id });
      setViewingId(null);
      const ok = await deleteEnquiry(id).then((r) => r.ok, () => false);
      if (ok) toast.success("Enquiry deleted");
      else toast.error("Could not delete the enquiry");
    });

  const columns = React.useMemo(
    () =>
      col.columns([
        col.accessor("name", {
          header: "Name",
          cell: ({ row }) => (
            <div className="flex max-w-56 flex-col">
              <Button
                variant="link"
                className="h-auto w-fit justify-start p-0 text-left font-medium text-foreground"
                onClick={() => setViewingId(row.original.id)}
              >
                <span className="truncate">{row.original.name}</span>
              </Button>
              {row.original.company ? (
                <span className="truncate text-xs text-muted-foreground">{row.original.company}</span>
              ) : null}
            </div>
          ),
          enableSorting: false,
        }),
        col.accessor("email", {
          header: "Email",
          cell: ({ row }) => (
            <Link href={replyHref(row.original)} className="block max-w-56 truncate text-muted-foreground hover:text-foreground hover:underline">
              {row.original.email}
            </Link>
          ),
          enableSorting: false,
        }),
        col.accessor("need", {
          header: "Needs",
          cell: ({ row }) => (
            <Badge variant="outline" className="px-1.5 text-muted-foreground">
              {row.original.need}
            </Badge>
          ),
          enableSorting: false,
        }),
        col.accessor("status", {
          header: "Status",
          cell: ({ row }) => (
            <StatusSelect
              id={`status-${row.original.id}`}
              label={`Status for ${row.original.name}`}
              value={row.original.status}
              onChange={(s) => updateStatus(row.original.id, s)}
            />
          ),
          enableSorting: false,
        }),
        col.accessor("createdAt", {
          header: ({ column }) => (
            <Button variant="ghost" size="sm" className="-ml-2.5" onClick={column.getToggleSortingHandler()}>
              Received
              <ArrowUpDownIcon className="size-3.5" />
            </Button>
          ),
          cell: ({ row }) => (
            <time dateTime={row.original.createdAt} suppressHydrationWarning className="whitespace-nowrap text-muted-foreground">
              {dateFmt(row.original.createdAt)}
            </time>
          ),
        }),
        col.display({
          id: "actions",
          header: () => <span className="sr-only">Actions</span>,
          cell: ({ row }) => (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" className="flex size-8 text-muted-foreground data-open:bg-muted" size="icon" />}
              >
                <EllipsisVerticalIcon />
                <span className="sr-only">Actions for {row.original.name}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => setViewingId(row.original.id)}>View message</DropdownMenuItem>
                <DropdownMenuItem render={<Link href={replyHref(row.original)} />}>Reply by email</DropdownMenuItem>
                <DropdownMenuSeparator />
                {enquiryStatuses
                  .filter((s) => s !== row.original.status)
                  .map((s) => (
                    <DropdownMenuItem key={s} onClick={() => updateStatus(row.original.id, s)}>
                      Mark {statusLabel[s]}
                    </DropdownMenuItem>
                  ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => setDeletingId(row.original.id)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        }),
      ]),
    [updateStatus],
  );

  const table = useTable({
    features,
    data: visible,
    columns,
    state: { sorting, pagination },
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  });

  const viewing = items.find((e) => e.id === viewingId) ?? null;
  const deleting = items.find((e) => e.id === deletingId) ?? null;

  return (
    <div className="flex w-full flex-col gap-4">
      {total !== undefined && total > enquiries.length ? (
        <p role="status" className="mx-4 rounded-lg border border-destructive/40 px-4 py-3 text-sm lg:mx-6">
          Showing the newest {enquiries.length.toLocaleString("en")} of {total.toLocaleString("en")} enquiries.
          Older ones are stored but not listed here.
        </p>
      ) : null}
      <div className="flex flex-col gap-3 px-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <ToggleGroup
          multiple={false}
          value={[filter]}
          onValueChange={(v) => {
            setFilter((v[0] as typeof filter) ?? "all");
            setPagination((p) => ({ ...p, pageIndex: 0 }));
          }}
          variant="outline"
          size="sm"
          aria-label="Filter by status"
          className="flex-wrap"
        >
          {(["all", ...enquiryStatuses] as const).map((s) => (
            <ToggleGroupItem key={s} value={s} className="gap-2 px-3!">
              {s === "all" ? "All" : statusLabel[s]}
              <Badge variant="secondary" className="h-5 min-w-5 rounded-full px-1.5 tabular-nums">
                {counts[s]}
              </Badge>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="relative w-full lg:w-72">
          <Label htmlFor="enquiry-search" className="sr-only">
            Search enquiries
          </Label>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="enquiry-search"
            type="search"
            placeholder="Search name, email, message"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPagination((p) => ({ ...p, pageIndex: 0 }));
            }}
            className="h-8 pl-8"
          />
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <div className="overflow-x-auto rounded-lg border bg-card">
          <Table>
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      aria-sort={
                        header.column.getIsSorted() === "asc"
                          ? "ascending"
                          : header.column.getIsSorted() === "desc"
                            ? "descending"
                            : undefined
                      }
                    >
                      {header.isPlaceholder ? null : <FlexRender header={header} />}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-status={row.original.status} className="data-[status=new]:bg-tint/40">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        <FlexRender cell={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-28 text-center text-muted-foreground">
                    {items.length === 0 ? "No enquiries yet. New ones from the contact form appear here." : "No enquiries match."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
          {visible.length} {visible.length === 1 ? "enquiry" : "enquiries"}
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${pagination.pageSize}`}
              onValueChange={(v) => v && table.setPageSize(Number(v))}
              items={[10, 20, 50].map((n) => ({ label: `${n}`, value: `${n}` }))}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectGroup>
                  {[10, 20, 50].map((n) => (
                    <SelectItem key={n} value={`${n}`}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button variant="outline" className="hidden size-8 p-0 lg:flex" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon />
            </Button>
            <Button variant="outline" className="size-8" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon />
            </Button>
            <Button variant="outline" className="size-8" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon />
            </Button>
          </div>
        </div>
      </div>

      <EnquiryViewer
        enquiry={viewing}
        onClose={() => setViewingId(null)}
        onStatus={(s) => viewing && updateStatus(viewing.id, s)}
        onDelete={() => viewing && setDeletingId(viewing.id)}
      />

      <AlertDialog open={deleting !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this enquiry?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting ? `The enquiry from ${deleting.name} will be permanently removed. This cannot be undone.` : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deleting) remove(deleting.id);
                setDeletingId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatusSelect({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: EnquiryStatus;
  onChange: (s: EnquiryStatus) => void;
}) {
  return (
    <Select value={value} items={statusItems} onValueChange={(v) => v && v !== value && onChange(v as EnquiryStatus)}>
      <SelectTrigger id={id} size="sm" className="w-34" aria-label={label}>
        <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${statusDot[value]}`} />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {statusItems.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function EnquiryViewer({
  enquiry,
  onClose,
  onStatus,
  onDelete,
}: {
  enquiry: Enquiry | null;
  onClose: () => void;
  onStatus: (s: EnquiryStatus) => void;
  onDelete: () => void;
}) {
  const isMobile = useIsMobile();
  // Keep the last enquiry while the drawer animates closed.
  const [shown, setShown] = React.useState(enquiry);
  if (enquiry && enquiry !== shown) setShown(enquiry);
  const e = enquiry ?? shown;

  return (
    <Drawer open={enquiry !== null} onOpenChange={(open) => !open && onClose()} swipeDirection={isMobile ? "down" : "right"}>
      <DrawerContent>
        {e ? (
          <>
            <DrawerHeader className="gap-1">
              <DrawerTitle>{e.name}</DrawerTitle>
              <DrawerDescription>
                <time dateTime={e.createdAt} suppressHydrationWarning>
                  {dateFmt(e.createdAt)}
                </time>              </DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-5 overflow-y-auto px-4 pt-2 text-sm">
              <dl className="grid grid-cols-[6rem_1fr] gap-x-4 gap-y-3">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="break-all">
                  <Link href={replyHref(e)} className="underline underline-offset-4">
                    {e.email}
                  </Link>
                </dd>
                <dt className="text-muted-foreground">Company</dt>
                <dd>{e.company || "—"}</dd>
                <dt className="text-muted-foreground">Needs</dt>
                <dd>{e.need}</dd>
              </dl>
              <Separator />
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Message</p>
                <p className="leading-relaxed break-words whitespace-pre-wrap">{e.message}</p>
              </div>
              <Separator />
              <div className="flex flex-col gap-2">
                <Label htmlFor="viewer-status">Status</Label>
                <StatusSelect id="viewer-status" label="Status" value={e.status} onChange={onStatus} />
              </div>
            </div>
            <DrawerFooter>
              <Button render={<Link href={replyHref(e)} />}>
                <MailIcon />
                Reply by email
              </Button>
              <Button variant="outline" className="text-destructive" onClick={onDelete}>
                <Trash2Icon />
                Delete
              </Button>
              <DrawerClose render={<Button variant="ghost" />}>Close</DrawerClose>
            </DrawerFooter>
          </>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}
