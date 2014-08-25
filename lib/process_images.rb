class ProcessImages

  def process_image image_id
    image = Image.unscoped.find(image_id)
    image.background_processed = true
    image.save
    image.do_background_work
    if image.restaurant
      image.restaurant.cache_job
    end
  end

  def before
    @start = Time.now
  end

  def after
    duration = ((Time.now - @start) * 1_000).round
    Rails.logger.info "ProcessImages time: #{duration}ms"
  end

end