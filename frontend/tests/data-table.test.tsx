import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable, type DataTableColumn } from "skyloom-ui";

const data = Array.from({ length: 12 }, (_, index) => ({ id: `row-${index + 1}`, name: `Item ${index + 1}` }));
const columns: DataTableColumn<(typeof data)[number]>[] = [{ id: "name", header: "Name", cell: row => row.name }];
const search = (row: (typeof data)[number]) => row.name;
const id = (row: (typeof data)[number]) => row.id;

describe("DataTable pagination", () => {
  it("paginates actual rows and handles a partial final page", async () => {
    render(<DataTable data={data} columns={columns} getRowId={id} caption="Items" initialPageSize={5} />);
    expect(screen.getByText("Item 1")).toBeTruthy();
    expect(screen.queryByText("Item 6")).toBeNull();
    expect((screen.getByRole("button", { name: "Previous" }) as HTMLButtonElement).disabled).toBe(true);
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Item 6")).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Showing 11–12 of 12 rows")).toBeTruthy();
    expect((screen.getByRole("button", { name: "Next" }) as HTMLButtonElement).disabled).toBe(true);
  });
  it("filters before pagination and resets the page", async () => {
    render(<DataTable data={data} columns={columns} getRowId={id} caption="Items" initialPageSize={5} searchText={search} />);
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    await userEvent.type(screen.getByLabelText("Search rows"), "Item 12");
    expect(screen.getByText("Item 12")).toBeTruthy();
    expect(screen.getByText("Showing 1–1 of 1 rows")).toBeTruthy();
    await userEvent.clear(screen.getByLabelText("Search rows"));
    await userEvent.type(screen.getByLabelText("Search rows"), "missing");
    expect(screen.getByText("No matching rows.")).toBeTruthy();
    expect(screen.getByText("Showing 0–0 of 0 rows")).toBeTruthy();
  });
  it("changes page size and clamps the page when the dataset shrinks", async () => {
    const { rerender } = render(<DataTable data={data} columns={columns} getRowId={id} caption="Items" initialPageSize={5} />);
    await userEvent.click(screen.getByRole("combobox", { name: "Rows per page" }));
    await userEvent.click(screen.getByRole("option", { name: "10", exact: true }));
    expect(screen.getByText("Showing 1–10 of 12 rows")).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    rerender(<DataTable data={data.slice(0, 2)} columns={columns} getRowId={id} caption="Items" initialPageSize={5} />);
    expect(screen.getByText("Showing 1–2 of 2 rows")).toBeTruthy();
    expect(screen.getByText("Item 1")).toBeTruthy();
  });
  it("shows loading and errors without misleading stale pagination", () => {
    const { rerender } = render(<DataTable data={data} columns={columns} getRowId={id} caption="Items" loading />);
    expect(screen.getByText("Loading rows…")).toBeTruthy();
    expect(screen.queryByRole("navigation")).toBeNull();
    rerender(<DataTable data={data} columns={columns} getRowId={id} caption="Items" error="Unable to load" />);
    expect(screen.getByRole("alert").textContent).toBe("Unable to load");
  });
});
