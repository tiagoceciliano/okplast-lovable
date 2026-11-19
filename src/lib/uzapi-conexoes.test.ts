import { describe, expect, it } from "vitest";
import { CONEXOES_UNOTALK } from "./uzapi-conexoes";

describe("importação autorizada do UnoTalk", () => {
  it("importa somente Amanda e Allan com os IDs informados", () => {
    expect(CONEXOES_UNOTALK.map((c) => [c.chave, c.phoneNumberId])).toEqual([
      ["amanda", "465703233845639"],
      ["allan", "133336448035765"],
    ]);
  });
});