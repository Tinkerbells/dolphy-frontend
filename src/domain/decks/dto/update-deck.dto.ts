import { PartialType } from '@/utils'

import { CreateDeckDto } from './create-deck.dto'

export class UpdateDeckDto extends PartialType(CreateDeckDto) {}
