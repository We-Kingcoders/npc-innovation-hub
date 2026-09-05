jest.mock("../client", () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

import apiClient from "../client";
import { getHeroMembers } from "./heroMembers.api";

const mockedGet = apiClient.get as jest.Mock;

const sampleMember = {
  id: "hm-1",
  name: "Jane Doe",
  imageUrl: "https://example.com/jane.jpg",
  role: "Full Stack Developer",
};

describe("getHeroMembers", () => {
  afterEach(() => jest.clearAllMocks());

  test("calls the hero-members route", async () => {
    mockedGet.mockResolvedValue({
      data: { status: "success", data: { heroMembers: [] } },
    });

    await getHeroMembers();

    expect(mockedGet).toHaveBeenCalledWith("/api/hero-members");
  });

  test("unwraps the standard { data: { heroMembers } } envelope", async () => {
    mockedGet.mockResolvedValue({
      data: { status: "success", data: { heroMembers: [sampleMember] } },
    });

    const result = await getHeroMembers();

    expect(result).toEqual([sampleMember]);
  });

  test("accepts a flat array response", async () => {
    mockedGet.mockResolvedValue({ data: [sampleMember] });

    const result = await getHeroMembers();

    expect(result).toEqual([sampleMember]);
  });

  test("accepts a { heroMembers } response with no data wrapper", async () => {
    mockedGet.mockResolvedValue({ data: { heroMembers: [sampleMember] } });

    const result = await getHeroMembers();

    expect(result).toEqual([sampleMember]);
  });

  test("accepts a { data: [...] } response with no heroMembers key", async () => {
    mockedGet.mockResolvedValue({ data: { data: [sampleMember] } });

    const result = await getHeroMembers();

    expect(result).toEqual([sampleMember]);
  });

  test("returns an empty array for an unrecognized shape instead of throwing", async () => {
    mockedGet.mockResolvedValue({ data: {} });

    const result = await getHeroMembers();

    expect(result).toEqual([]);
  });
});
