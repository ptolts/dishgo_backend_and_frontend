module Paperclip
	class Cropper < Thumbnail
		def transformation_command
			if crop_command
				crop_command + super.join(' ').sub(/ -crop \S+/, '').split(' ')
			else
				super
			end
		end

		def crop_command
			target = @attachment.instance
			coordinates = target.get_coordinates
			if coordinates
				ratio = 1000.to_f / @target_geometry.width.to_f
				coordinates_r = coordinates.collect{|e| next (e * ratio)}
			end
	      #[coords.x,coords.y,coords.w,coords.h]
	      if target.cropping?
	      	["-crop","#{coordinates_r[2]}x#{coordinates_r[3]}+#{coordinates_r[0]}+#{coordinates_r[1]}"]
	      end     
  		end
	end
end

module Paperclip
	class HasAttachedFile

		def add_active_record_callbacks
			name = @name
			@klass.send(:after_save) { send(name).send(:save) }
			@klass.send(:before_destroy) { send(name).send(:queue_all_for_delete) }
			if @klass.respond_to?(:after_commit)
				@klass.send(:after_commit, :on => :destroy) { send(name).send(:flush_deletes) }
			else
				@klass.send(:after_destroy) { send(name).send(:flush_deletes) }
			end
		end

		def add_required_validations
			name = @name
			@klass.validates_media_type_spoof_detection name, :if => ->{ send(name).dirty? }
		end

	end
end

module AttachmentExtensions
  def after_flush_writes
    super
	if @queued_for_write[:original] and @instance.respond_to?(:background_processed) and !@instance.background_processed
      Rails.logger.warn "Background work on #{@queued_for_write[:original]}"
      if @instance.kind_of?(Image)
      	ProcessImages.new.delay.process_image(@instance.id)		
      else
      	ProcessImages.new.delay.process_cover_image(@instance.id)		
      end
    end
  end
end

module Paperclip
  class Attachment
  	prepend AttachmentExtensions
  end
end