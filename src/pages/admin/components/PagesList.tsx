import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TopPage {
  path: string;
  count: number;
}

interface LeadByProduct {
  product: string;
  count: number;
}

interface PagesListProps {
  topPages: TopPage[];
  leadsByProduct: LeadByProduct[];
  isLoading?: boolean;
}

export function PagesList({ topPages, leadsByProduct, isLoading }: PagesListProps) {
  const SkeletonRows = () => (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <TableRow key={i}>
          <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
          <TableCell><div className="h-4 w-12 bg-muted animate-pulse rounded" /></TableCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top 5 Páginas</CardTitle>
          <CardDescription>Páginas mais visitadas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Página</TableHead>
                <TableHead className="text-right">Visitas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <SkeletonRows />
              ) : topPages.length > 0 ? (
                topPages.map((page) => (
                  <TableRow key={page.path}>
                    <TableCell className="font-medium truncate max-w-[150px]" title={page.path}>
                      {page.path === '/' ? 'Home' : page.path}
                    </TableCell>
                    <TableCell className="text-right">{page.count}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    Sem dados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Leads por Produto</CardTitle>
          <CardDescription>Interesse por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="text-right">Leads</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <SkeletonRows />
              ) : leadsByProduct.length > 0 ? (
                leadsByProduct.map((item) => (
                  <TableRow key={item.product}>
                    <TableCell className="font-medium truncate max-w-[150px]" title={item.product}>
                      {item.product}
                    </TableCell>
                    <TableCell className="text-right">{item.count}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    Sem dados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
