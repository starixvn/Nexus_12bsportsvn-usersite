ARG CI_REGISTRY_IMAGE

FROM $CI_REGISTRY_IMAGE:builder AS deps

RUN mkdir -p /src/packages

FROM hub.nexdev.net/base/dotnet/core/sdk:8.0-alpine AS builder

ENV NUGET_PACKAGES=/src/packages

COPY --from=deps $NUGET_PACKAGES/. $NUGET_PACKAGES/

WORKDIR /src

COPY ["SabaNews.Models", "SabaNews.Models"]
COPY ["SabaNews.Services", "SabaNews.Services"]
COPY ["SabaNews.Criteria", "SabaNews.Criteria"]
COPY ["SabaNews.Core", "SabaNews.Core"]
COPY ["SabaNews.Resources", "SabaNews.Resources"]
COPY ["Livescore/SabaNews.Livescore.Core", "Livescore/SabaNews.Livescore.Core"]
COPY ["Livescore/SabaNews.Livescore.Models", "Livescore/SabaNews.Livescore.Models"]
COPY ["Livescore/SabaNews.Livescore.Repositories", "Livescore/SabaNews.Livescore.Repositories"]
COPY ["Livescore/SabaNews.Livescore.Services", "Livescore/SabaNews.Livescore.Services"]
COPY ["SabaNews.Site/SabaNews.Site.csproj", "SabaNews.Site/"]
COPY ["nuget.config", ""]

RUN dotnet nuget add source https://nuget.nexdev.net/api/v2

RUN dotnet restore "SabaNews.Site/SabaNews.Site.csproj"

COPY . .

WORKDIR "/src/SabaNews.Site"

RUN dotnet publish -r linux-x64 --self-contained false -o /app

FROM hub.nexdev.net/base/dotnet/core/aspnet:8.0-alpine-25h1 AS base

WORKDIR /app

COPY --from=builder /app .

ENTRYPOINT ["dotnet", "SabaNews.Site.dll"]
