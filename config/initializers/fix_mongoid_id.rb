module BSON
  class ObjectId   
    def to_json
      self.to_s.to_json
    end
    def as_json(options = {})
      self.to_s.as_json
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
