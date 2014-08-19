class CacheJson
  def rebuild_cache restaurant_id
    restaurant = Restaurant.find(restaurant_id)
    cache = restaurant.cache
    cache ||= Cache.new
    cache.api_menu = restaurant.api_menu_to_json
    cache.menu = restaurant.onlinesite_json
    cache.save
    restaurant.calculate_rating
    restaurant.save!(verified:false)
    Rails.logger.info "Setting rating to #{restaurant.rating}"
    puts "Setting rating to #{restaurant.rating}"
  end

  def publish_menu restaurant_id
    restaurant = Restaurant.find(restaurant_id)
    restaurant.menus.each do |menu|
      menu.name_translations = menu.draft["name"]
      menu.published_menu = menu.draft_menu
      menu.published_menu.each do |section|
        section.publish_menu
      end
      menu.save
    end
    restaurant.cache_job
  end

  def before
    @start = Time.now
  end

  def after
    duration = ((Time.now - @start) * 1_000).round
    Rails.logger.info "CacheJson time: #{duration}ms"
  end
end