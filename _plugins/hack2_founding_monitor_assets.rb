# frozen_string_literal: true

require "base64"
require "fileutils"

module Hack2FoundingMonitorAssets
  TARGET_URL = "/lp/hack2/founding-monitor/"
  CHUNK_ROOT = "_asset_chunks/hack2-founding-monitor"
  OUTPUT_ROOT = "images/lp/hack2/founding-monitor"
  ASSETS = {
    "01_hero_visual_1600x900.webp" => "hero-visual.webp",
    "02_wide_ad_1200x628.webp" => "wide-ad.webp",
    "03_competitor_square_1080x1080.webp" => "competitor-comparison.webp",
    "04_90day_plan_900x1200.webp" => "plan-90days.webp",
    "05_url_cta_banner_1600x500.webp" => "url-cta-banner.webp",
    "06_founding_badge_transparent_1000x1000.webp" => "founding-badge.webp",
    "07_mascot_popup_transparent_1000x1000.webp" => "mascot-popup.webp",
    "08_cta_flow_1600x600.webp" => "application-flow.webp",
    "09_dashboard_mockup_1400x900.webp" => "dashboard.webp",
    "10_mobile_vertical_1080x1920.webp" => "mobile-vertical.webp"
  }.freeze

  class GeneratedAsset < Jekyll::StaticFile
    def initialize(site, base, dir, name, contents)
      super(site, base, dir, name)
      @contents = contents
    end

    def modified?
      true
    end

    def write(dest)
      target = destination(dest)
      FileUtils.mkdir_p(File.dirname(target))
      File.binwrite(target, @contents)
      true
    end
  end

  class Generator < Jekyll::Generator
    safe true
    priority :highest

    def generate(site)
      ASSETS.each do |source_name, output_name|
        pattern = File.join(site.source, CHUNK_ROOT, "#{source_name}.part*")
        parts = Dir.glob(pattern).sort
        if parts.empty?
          Jekyll.logger.warn "Hack2 assets:", "missing chunks for #{source_name}"
          next
        end

        encoded = parts.map { |path| File.read(path, encoding: "US-ASCII").strip }.join
        contents = Base64.strict_decode64(encoded)
        site.static_files << GeneratedAsset.new(
          site,
          site.source,
          OUTPUT_ROOT,
          output_name,
          contents
        )
      rescue ArgumentError => e
        Jekyll.logger.error "Hack2 assets:", "failed to decode #{source_name}: #{e.message}"
        raise
      end
    end
  end
end

Jekyll::Hooks.register :pages, :pre_render do |page|
  next unless page.url == Hack2FoundingMonitorAssets::TARGET_URL

  page.data["og_image"] = "https://trillion-bank.jp/images/lp/hack2/founding-monitor/hero-visual.webp"
end

Jekyll::Hooks.register :pages, :post_render do |page|
  next unless page.url == Hack2FoundingMonitorAssets::TARGET_URL
  next unless page.output.include?("</head>")

  tags = <<~HTML
    <link rel="preload" as="image" href="/images/lp/hack2/founding-monitor/hero-visual.webp" type="image/webp" fetchpriority="high">
    <link rel="stylesheet" href="/assets/css/hack2-founding-monitor-media.css?v=20260820">
    <script defer src="/assets/js/hack2-founding-monitor-media.js?v=20260820"></script>
  HTML

  page.output = page.output.sub("</head>", "#{tags}</head>")
end
